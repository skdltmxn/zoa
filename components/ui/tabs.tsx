'use client'

import {
  createContext,
  useContext,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue: string
  value?: string
  onChange?: (value: string) => void
}

function Tabs({
  defaultValue,
  value: controlledValue,
  onChange: controlledOnChange,
  children,
  className,
  ...props
}: TabsProps): React.ReactElement {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  const onChange = (newValue: string): void => {
    if (isControlled) {
      controlledOnChange!(newValue)
    } else {
      setUncontrolledValue(newValue)
      controlledOnChange?.(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn('', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

type TabsListProps = HTMLAttributes<HTMLDivElement>

function TabsList({ className, ...props }: TabsListProps): React.ReactElement {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-bg-secondary rounded-lg border border-border-default',
        className
      )}
      role="tablist"
      {...props}
    />
  )
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({
  value,
  className,
  ...props
}: TabsTriggerProps): React.ReactElement {
  const { value: selectedValue, onChange } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-border-focus',
        isSelected
          ? 'bg-accent-primary/20 text-accent-primary'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
        className
      )}
      onClick={() => onChange(value)}
      {...props}
    />
  )
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps): React.ReactElement | null {
  const { value: selectedValue } = useTabsContext()

  if (selectedValue !== value) {
    return null
  }

  return (
    <div
      role="tabpanel"
      className={cn('mt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
