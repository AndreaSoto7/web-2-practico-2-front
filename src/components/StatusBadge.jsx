import { ESTADO_LABELS } from '../utils/tickets';

export default function StatusBadge({ estado }) {
  return <span className={`status ${estado}`}>{ESTADO_LABELS[estado] || estado}</span>;
}
