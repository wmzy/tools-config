type Props = { name: string };

function Hello({ name }: Props) {
  return <div>{name}</div>;
}

export function App() {
  return <Hello name="world" />;
}
