import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // ADD
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LeadsTable } from '../components/lead-table/LeadsTable';
import { CreateLeadForm } from '../components/create-lead-modal/CreateLeadModal';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams(); // ADD
  const modalOpenedRef = useRef(false); // Track if modal has been opened to prevent multiple opens

  const fetchLeads = () => {
    fetch('http://localhost:8000/leads/')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => setLeads(data))
      .catch(err => console.error('Failed to fetch leads:', err));
  };

  const openCreateModal = () => {
    modals.open({
      title: 'Create New Lead',
      children: <CreateLeadForm onLeadCreated={fetchLeads} />,
    });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'create' && !modalOpenedRef.current) {
      modalOpenedRef.current = true;
      setSearchParams({}, { replace: true });
      modals.open({
        title: 'Create New Lead',
        children: <CreateLeadForm onLeadCreated={fetchLeads} />,
      });
    }
  }, []);

  return (
    <>
      <Button radius="md" mb="md" onClick={openCreateModal}>
        Create New Lead
      </Button>
      <LeadsTable leads={leads} onLeadUpdated={fetchLeads} />
    </>
  );
};

export default LeadsPage;