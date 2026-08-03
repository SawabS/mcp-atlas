/** Fixed atmospheric backdrop: drifting aurora, hairline mesh, film grain. */
export function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky-veil">
        <i />
        <i />
        <i />
      </div>
      <div className="sky-mesh" />
      <div className="sky-floor" />
      <div className="sky-grain" />
    </div>
  );
}
