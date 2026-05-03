import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClientTableSort } from '../components/client-table/ClientTableSort';
import { CreateClientForm } from '../components/create-client-modal/CreateClientModal';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const modalOpenedRef = useRef(false);
  const fetchClients = () => {
    fetch('http://localhost:8000/clients/')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => setClients(data))
      .catch(err => console.error('Failed to fetch clients:', err));
  };

  const openCreateClientModal = () => {
    modals.open({
      title: 'Create New Client',
      children: <CreateClientForm onClientCreated={fetchClients} />,
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'create' && !modalOpenedRef.current) {
      modalOpenedRef.current = true;
      openCreateClientModal();
      setSearchParams({}, { replace: true });
    }
  }, []);

const formattedData = clients.map((client: any) => ({
    id: client.id,
    customerInfo: {
        leadId: client.lead,
        name: String(client.lead_name),
        company: client.lead_company,
        email: client.lead_email,
        phone: client.lead_phone,
        created: client.created ?? 'N/A',
        lastContacted: client.last_contacted ?? 'N/A',
        nextFollowUp: client.next_follow_up,
        source: client.lead_source,
    },
    billingCycle: client.billing_cycle,
    initialQuote: String(client.initial_quote),
    paymentMethod: client.payment_method,
    status: client.status,
    preferredContactMethod: client.preferred_contact_method,
    latest_note: client.latest_note, 
}));

  return (
    <>
      <Button radius="md" mb="md" onClick={openCreateClientModal}>
        Create New Client
      </Button>
      <ClientTableSort data={formattedData} onClientUpdated={fetchClients}/>
    </>
  );
};

export default ClientsPage;