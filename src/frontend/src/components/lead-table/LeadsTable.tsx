import { useEffect, useState } from 'react';
import cx from 'clsx';
import { ScrollArea, Table, TextInput } from '@mantine/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { LeadCard } from '../lead-card/LeadCard';
import classes from './LeadsTable.module.css';
import { IconSearch } from '@tabler/icons-react';

interface Lead {
  id: number;
  name: string;
  phone: string;
  latest_note: string;
  source: string;
  email: string;
  create_time: string;
  last_contacted: string | null;
  next_follow_up: string | null;
  company: string;
  estimated_value: number | null;
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATION' | 'WON' | 'DISCOVERY' | 'PROPOSAL' | 'LOST';
}

interface LeadWithId extends Lead {
  _id: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onLeadUpdated: () => void;
}

const STATUSES = ['NEW', 'CONTACTED', 'NEGOTIATION', 'WON'] as const;
type Status = (typeof STATUSES)[number];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  const d = new Date(dateStr.split('T')[0] + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function filterLeads(data: LeadWithId[], search: string): LeadWithId[] {
  if (!search) return data;
  const lower = search.toLowerCase();
  return data.filter((l) =>
    l.name.toLowerCase().includes(lower) ||
    l.status.toLowerCase().includes(lower) ||
    l.source.toLowerCase().includes(lower) ||
    (l.estimated_value !== null && l.estimated_value.toString().includes(lower)) ||
    (l.next_follow_up && l.next_follow_up.toLowerCase().includes(lower))
  );
}

function DraggableLead({ lead, onLeadUpdated }: { lead: LeadWithId; onLeadUpdated: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead._id,
    data: { lead },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0 : 1,
    cursor: 'grab',
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <LeadCard
        id={lead.id}
        fullName={lead.name}
        created={formatDate(lead.create_time)}
        lastContacted={formatDate(lead.last_contacted)}
        nextFollowUp={formatDate(lead.next_follow_up)}
        email={lead.email}
        phone={lead.phone}
        notes={lead.latest_note}
        company={lead.company}
        badges={[{ emoji: '🔵', label: lead.source }]}
        estimated_value={lead.estimated_value}
        source={lead.source}
        onLeadUpdated={onLeadUpdated}
      />
    </div>
  );
}

function DroppableColumn({ status, leads, onLeadUpdated }: { status: Status; leads: LeadWithId[]; onLeadUpdated: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <Table.Td
      ref={setNodeRef}
      style={{
        verticalAlign: 'top',
        background: isOver ? 'var(--mantine-color-blue-0)' : undefined,
        transition: 'background 150ms ease',
        minWidth: 220,
      }}
    >
      {leads.map((lead) => (
        <DraggableLead key={lead._id} lead={lead} onLeadUpdated={onLeadUpdated} />
      ))}
    </Table.Td>
  );
}

export function LeadsTable({ leads: initialLeads, onLeadUpdated }: LeadsTableProps) {
  const [leads, setLeads] = useState<LeadWithId[]>(() =>
    initialLeads.map((l, i) => ({ ...l, _id: `lead-${i}-${l.email}` }))
  );
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLeads(initialLeads.map((l) => ({ ...l, _id: `lead-${l.id}` })));
  }, [initialLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeLead = activeId ? leads.find((l) => l._id === activeId) ?? null : null;
  const visibleLeads = filterLeads(leads, search);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const newStatus = over.id as Status;
    const draggedId = active.id as string;
    const lead = leads.find((l) => l._id === draggedId);

    setLeads((prev) =>
      prev.map((l) => (l._id === draggedId ? { ...l, status: newStatus } : l))
    );

    if (lead) {
      fetch(`http://localhost:8000/leads/${lead.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
        .then(res => {
          if (!res.ok) throw new Error(`Failed to update lead: ${res.status}`);
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <TextInput
        placeholder="Search by name, status, source, value, or follow-up"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <ScrollArea h="95vh" onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={900} layout="fixed">
          <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
              {STATUSES.map((s) => (
                <Table.Th key={s}>{s}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              {STATUSES.map((status) => (
                <DroppableColumn
                  key={status}
                  status={status}
                  leads={visibleLeads.filter((l) => l.status === status)}
                  onLeadUpdated={onLeadUpdated}
                />
              ))}
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <DragOverlay dropAnimation={null}>
          {activeLead ? (
            <LeadCard
              id={activeLead.id}
              fullName={activeLead.name}
              created={formatDate(activeLead.create_time)}
              lastContacted={formatDate(activeLead.last_contacted)}
              nextFollowUp={formatDate(activeLead.next_follow_up)}
              email={activeLead.email}
              phone={activeLead.phone}
              notes={activeLead.latest_note}
              company={activeLead.company}
              badges={[{ emoji: '🔵', label: activeLead.source }]}
              estimated_value={activeLead.estimated_value}
              source={activeLead.source}
              onLeadUpdated={onLeadUpdated}
            />
          ) : null}
        </DragOverlay>
      </ScrollArea>
    </DndContext>
  );
}