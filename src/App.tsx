import { Card, TextLabel } from "./components/Card";
import { mockLabels, mockText } from "./mock";
import styles from "./styles.module.scss";

const handleChange = (newLabeling: TextLabel[]) => {
  console.log("Updated Labeling:", newLabeling);
};

function App() {
  return (
    <div className={styles.root}>
      <Card
        labels={mockLabels}
        text={mockText}
        labeling={[]}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
