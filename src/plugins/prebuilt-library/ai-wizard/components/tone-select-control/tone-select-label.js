export function ToneSelectLabel( props ) {
  const { label, description } = props;

  return (
    <div className="tone-select__option">
      <b>{ label }.</b>
      { description ? ` ${ description }` : null }
    </div>
  )
}

