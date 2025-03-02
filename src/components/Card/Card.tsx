import { useEffect, useRef, useState } from "react";
import { Labels, LabelsProps } from "./helperComponents";
import styles from "./styles.module.scss";

export type TextLabel = {
  start: number;
  end: number;
  label: string;
};

export type TextLabelingProps = {
  labels: LabelsProps[];
  text: string;
  labeling: TextLabel[];
  onChange: (labels: TextLabel[]) => void;
};

const highlightText = (
  text: string,
  labeling: TextLabel[],
  labels: LabelsProps[]
) => {
  let highlightedText = "";
  let lastIndex = 0;

  const sortedLabels = [...labeling].sort((a, b) => a.start - b.start);

  sortedLabels.forEach((label) => {
    highlightedText += text.slice(lastIndex, label.start);

    highlightedText += `<span style="background-color: ${
      labels.find((curLabel) => curLabel.label === label.label)?.color
    }">${text.slice(label.start, label.end)}</span>`;

    lastIndex = label.end;
  });

  highlightedText += text.slice(lastIndex);

  return highlightedText;
};

export function Card({ labels, text, labeling, onChange }: TextLabelingProps) {
  const [curLabeling, setCurLabeling] = useState(labeling);
  const [curLabel, setCurLabel] = useState<LabelsProps | null>(null);
  const [highlightedText, setHighlightedText] = useState(() =>
    highlightText(text, labeling, labels)
  );

  useEffect(() => {
    setHighlightedText(() => highlightText(text, curLabeling, labels));
    onChange(curLabeling);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curLabeling]);

  const textRef = useRef<HTMLParagraphElement>(null);

  const getGlobalSelectionIndices = (range: Range) => {
    if (!textRef.current) return { start: 0, end: 0 };

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(textRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);

    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    return { start, end };
  };

  const overlapping = (newLabel: TextLabel) => {
    const { start, end } = newLabel;

    const overlappingLabels = curLabeling.filter(
      (label) =>
        (start >= label.start && start < label.end) ||
        (end > label.start && end <= label.end) ||
        (start <= label.start && end >= label.end)
    );

    if (overlappingLabels.length === 0) {
      setCurLabeling((prev) =>
        [...prev, newLabel].sort((a, b) => a.start - b.start)
      );
      return;
    }

    let updatedLabels = [...curLabeling];

    overlappingLabels.forEach((label) => {
      updatedLabels = updatedLabels.filter((l) => l !== label);
    });

    updatedLabels.push(newLabel);

    updatedLabels.sort((a, b) => a.start - b.start);

    setCurLabeling(updatedLabels);
  };

  const handleTextSelection = () => {
    if (curLabel === null) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const { start, end } = getGlobalSelectionIndices(range);

      if (start === end) return;

      const newLabeling = {
        start: start,
        end: end,
        label: curLabel.label,
      };

      overlapping(newLabeling);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h3 className={styles.title}>Документ</h3>

        <div
          ref={textRef}
          onMouseUp={handleTextSelection}
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      <div className={styles.labels}>
        <h3 className={styles.title}>Метки</h3>

        <div className={styles.column}>
          <Labels labels={labels} active={curLabel} setState={setCurLabel} />
        </div>
      </div>
    </div>
  );
}
