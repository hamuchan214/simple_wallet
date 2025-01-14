import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SummaryCard from '../../components/dashboard/SummaryCard'

describe('SummaryCard', () => {
  it('renders amount with correct format', () => {
    render(
      <SummaryCard
        title="テスト"
        amount={10000}
        type="income"
      />
    )

    expect(screen.getByText('¥10,000')).toBeInTheDocument()
    expect(screen.getByText('テスト')).toBeInTheDocument()
  })

  it('shows correct color for expense', () => {
    render(
      <SummaryCard
        title="支出"
        amount={5000}
        type="expense"
      />
    )

    expect(screen.getByText('支出')).toBeInTheDocument()
    expect(screen.getByText('¥5,000')).toBeInTheDocument()
  })
}) 