import type { MDXComponents } from 'mdx/types'
import { Children } from 'react'

function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  const filtered = Children.map(children, (child) => {
    if (typeof child === 'string') return null
    return child
  })
  return (
    <div style={{ overflowX: 'auto' }}>
      <table {...props}>{filtered}</table>
    </div>
  )
}

function THead({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  const filtered = Children.map(children, (child) => {
    if (typeof child === 'string') return null
    return child
  })
  return <thead {...props}>{filtered}</thead>
}

function TBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  const filtered = Children.map(children, (child) => {
    if (typeof child === 'string') return null
    return child
  })
  return <tbody {...props}>{filtered}</tbody>
}

function TR({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  const filtered = Children.map(children, (child) => {
    if (typeof child === 'string') return null
    return child
  })
  return <tr {...props}>{filtered}</tr>
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    table: Table,
    thead: THead,
    tbody: TBody,
    tr: TR,
  }
}
