import React from 'react'

interface Props {
  id: string
  value: string
  onChange: (value: string) => void
}

export const Textarea: React.FC<Props> = ({ id, value, onChange }) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={8}
      className="w-full border border-gray-300 rounded-lg p-4"
    />
  )
}