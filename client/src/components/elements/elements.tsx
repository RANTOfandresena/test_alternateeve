export function Textarea(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...rest}
        rows={3}
        className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
      />
    </div>
  );
}

export function Select({ label, options, ...rest }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...rest}
        className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
      >
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text as string}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Input(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...rest}
        className="mt-1 w-full rounded-md border-gray-200 shadow-sm"
      />
    </div>
  );
}