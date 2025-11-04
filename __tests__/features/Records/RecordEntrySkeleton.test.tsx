import { RecordEntrySkeleton } from "@/features/Records/RecordEntrySkeleton"
import { render, screen } from "@testing-library/react"

describe('RecordEntrySkeleton', () => {
  it('Show record entry skeleton', () => {
    render(<RecordEntrySkeleton />)

    expect(screen.getByTestId('record-entry-skeleton')).toBeInTheDocument()
  })
})