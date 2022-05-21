# Start Investigation

## Data

### Input

- mode
- userId
- filterFinishedCases

### Output

- investigationId
- case
  - id
  - snippet

---

## Pre-condition

- User is authenticated

---

## Primary Course

- User orders start investigation command with input data
- System validates the input data
- System picks a case based on the filter option
- System returns output data

---

## Exception Course

- Validation
- No available cases

---

## Actor

---
