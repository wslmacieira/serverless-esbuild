export default function getData() {
  return Array.from({ length: 200 }, (_, idx) => idx + 1)
}