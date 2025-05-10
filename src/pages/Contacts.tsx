
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getContacts, Contact } from '@/lib/db/contacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Loader2, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch contacts. Please check your connection.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Contact List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No contacts found.</p>
              <p className="mt-2">Create your first contact to get started.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link to={`/contacts/${contact.id}`} className="text-brand-blue hover:underline">
                          {contact.name}
                        </Link>
                      </TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{contact.company || '-'}</TableCell>
                      <TableCell>
                        <span className={`status-badge status-${contact.status?.toLowerCase() || 'active'}`}>
                          {contact.status || 'Active'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
