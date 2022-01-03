import Item from "../models/Item";

const DEFAULT_ITEMS: [Item<number>, Item<number>, ...Item<number>[]] = [
  new Item("Completamente dependente", 1),
  new Item("Ajuda em mais de 50% da tarefa", 2),
  new Item("Pequena ajuda", 3),
  new Item("Apenas supervisão", 4),
  new Item("Completamente independente", 5),
];
export class AutonomyList {
  constructor(private items: [Item<number>, Item<number>, ...Item<number>[]] = DEFAULT_ITEMS) {}

  get sorted() {
    return [...this.items].sort((i1, i2) => i2.value - i1.value);
  }
  get range(): [number, number] {
    const allValues = this.sorted.map(i => i.value);
    const first = allValues[0];
    const last = allValues.pop()!;
    return [first, last];
  }
  get labels() {
    const labels = this.sorted.map(i => i.label);
    return labels;
  }
}
export const autonomyList = new AutonomyList();
 