# Button Design Standards

## Reference
Source: `/dashboard/accounting/reports/profit-and-loss`

## Standard Design
All buttons across the application (especially filters, date pickers, and secondary actions) should follow the design found on the Profit & Loss page.

### 1. Standard Button (Action/Secondary)
Used for actions like "Print", "Export", or general secondary actions.

- **Component**: `Button` (from `@/components/ui/button`)
- **Variant**: `outline`
- **Structure**: Flexbox with `gap-2` for icons.
- **Icon Size**: `h-4 w-4`
- **Code Example**:
  ```tsx
  <Button variant="outline" className="flex items-center gap-2">
      <Printer className="h-4 w-4" />
      Print
  </Button>
  ```

### 2. Filter/Dropdown Trigger Button
Used for Date Pickers, Select Triggers masquerading as buttons, and Popovers.

- **Component**: `Button`
- **Variant**: `outline`
- **Width**: `w-[140px]` (standard width for filters, can be adjusted if needed but should remain compact).
- **Alignment**: `justify-start text-left`
- **Font Weight**: `font-normal`
- **State Styling**: Add `text-muted-foreground` if no specific value is selected (placeholder state).
- **Code Example**:
  ```tsx
  <Button
      variant="outline"
      className={cn(
          "w-[140px] justify-start text-left font-normal",
          !value && "text-muted-foreground"
      )}
  >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value ? format(value, "PP") : <span>Pick a date</span>}
  </Button>
  ```

## Implementation Role
*   **Uniformity**: Ensure "width, height, and design" match this standard.
*   **Colors**: While the reference uses the default outline (black/gray text, white bg, gray border), if a button needs to be **colorful** (e.g., Primary Action), it should maintain the same **Height** (via standard padding) and **Shape** (border radius) as the outline button, just changing the background/border color.
