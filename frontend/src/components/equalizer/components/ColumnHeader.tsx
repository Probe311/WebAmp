interface ColumnHeaderProps {
  title: string
  icon?: React.ReactNode
}

export function ColumnHeader({ title, icon }: ColumnHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      {icon && (
        <div className="text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
      <div className="text-[9px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase">
        {title}
      </div>
    </div>
  )
}

