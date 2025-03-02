import { Dispatch, SetStateAction } from "react";
import { ValueOf } from "../../utils";
import { COLORS } from "./constants";
import styles from "./styles.module.scss";

import cn from "classnames";

export type LabelsProps = {
  color: ValueOf<typeof COLORS>;
  label: string;
};

export function Labels({
  labels,
  active,
  setState,
}: {
  labels: LabelsProps[];
  active: LabelsProps | null;
  setState: Dispatch<SetStateAction<LabelsProps | null>>;
}) {
  return (
    <ul className={styles.root}>
      {labels.map((curLabel, index) => (
        <li
          onClick={() => setState(curLabel)}
          className={cn(styles.label, {
            [styles.active]: active?.color === curLabel.color,
          })}
          key={index}
          data-color={curLabel.color}
        >
          <span className={styles.root}>{curLabel.label}</span>
        </li>
      ))}
    </ul>
  );
}
