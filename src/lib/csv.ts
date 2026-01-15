export type CsvTable = {
  headers: string[]
  rows: Array<Record<string, string>>
}

function stripBom(value: string): string {
  // Google exports sometimes include a UTF-8 BOM at the start of the first cell.
  return value.replace(/^\uFEFF/, "")
}

function normalizeHeader(value: string, index: number): string {
  const trimmed = value.trim()
  if (trimmed) return trimmed
  return `Column ${index + 1}`
}

// Minimal RFC4180-ish CSV parser:
// - Handles commas, CRLF/LF newlines
// - Handles quoted fields with escaped quotes ("")
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let i = 0
  let inQuotes = false

  const pushField = () => {
    row.push(field)
    field = ""
  }

  const pushRow = () => {
    // Avoid adding a trailing empty row if the file ends with a newline
    if (row.length === 1 && row[0] === "" && rows.length === 0) {
      rows.push([""])
      return
    }
    rows.push(row)
    row = []
  }

  while (i < text.length) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        const next = text[i + 1]
        if (next === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }

      field += ch
      i += 1
      continue
    }

    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }

    if (ch === ",") {
      pushField()
      i += 1
      continue
    }

    if (ch === "\n") {
      pushField()
      pushRow()
      i += 1
      continue
    }

    if (ch === "\r") {
      // Handle CRLF
      if (text[i + 1] === "\n") {
        pushField()
        pushRow()
        i += 2
        continue
      }
      pushField()
      pushRow()
      i += 1
      continue
    }

    field += ch
    i += 1
  }

  pushField()
  if (row.length > 1 || row[0] !== "" || rows.length === 0) {
    pushRow()
  }

  // Drop fully empty trailing rows
  while (rows.length > 0) {
    const last = rows[rows.length - 1]
    if (!last) break
    if (last.every((cell) => (cell ?? "").trim() === "")) {
      rows.pop()
      continue
    }
    break
  }

  return rows
}

export function csvToTable(text: string): CsvTable {
  const matrix = parseCsv(text)

  const firstNonEmptyRowIndex = matrix.findIndex((r) =>
    (r ?? []).some((cell) => stripBom(String(cell ?? "")).trim() !== "")
  )
  const headerRowIndex = firstNonEmptyRowIndex === -1 ? 0 : firstNonEmptyRowIndex

  const headerRowRaw = matrix[headerRowIndex] ?? []
  const headerRow = headerRowRaw.map((cell, idx) => {
    const cleaned = stripBom(String(cell ?? "")).trim()
    return normalizeHeader(cleaned, idx)
  })

  const rawHeaders = headerRow

  // Ensure unique headers
  const seen = new Map<string, number>()
  const headers = rawHeaders.map((h) => {
    const count = seen.get(h) ?? 0
    seen.set(h, count + 1)
    return count === 0 ? h : `${h} (${count + 1})`
  })

  const dataRows = matrix.slice(headerRowIndex + 1) ?? []

  // If the first data row is literally the headers again (common when exporting
  // from some sources), drop it so it doesn't show up as a record.
  const normalizedHeadersForCompare = headers.map((h) => h.trim().toLowerCase())
  const maybeFirst = dataRows[0]
  const isDuplicatedHeaderRow =
    Array.isArray(maybeFirst) &&
    maybeFirst.length > 0 &&
    normalizedHeadersForCompare.every((h, idx) => {
      const cell = stripBom(String(maybeFirst[idx] ?? "")).trim().toLowerCase()
      return cell === h
    })

  const effectiveDataRows = isDuplicatedHeaderRow ? dataRows.slice(1) : dataRows

  const rows = effectiveDataRows.map((cells) => {
    const record: Record<string, string> = {}
    headers.forEach((header, idx) => {
      record[header] = stripBom(String(cells?.[idx] ?? "")).trim()
    })
    return record
  })

  // Drop rows that are entirely blank
  const filtered = rows.filter((r) => headers.some((h) => (r[h] ?? "").trim() !== ""))

  return { headers, rows: filtered }
}
