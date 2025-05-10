
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createTableSQL } from '@/lib/db/contacts';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SetupDatabase = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createDatabaseTables = async () => {
    try {
      setIsCreating(true);
      
      // Execute the SQL to create tables
      const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (error) {
        console.error('Error creating tables:', error);
        toast({
          variant: 'destructive',
          title: 'Database Error',
          description: `Failed to create tables: ${error.message}`
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Database tables created successfully'
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: `An unexpected error occurred: ${error.message}`
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Create the necessary tables for the contacts management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create the following tables in your Supabase database:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>contacts: Store main contact information</li>
            <li>addresses: Store multiple addresses per contact</li>
            <li>tags: Store tag definitions</li>
            <li>contact_tags: Join table for contacts and tags</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={createDatabaseTables} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? 'Creating Tables...' : 'Create Database Tables'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Manual Setup Instructions</CardTitle>
          <CardDescription>
            If the automatic setup doesn't work, you can manually create the tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Copy and paste the following SQL into your Supabase SQL editor:
          </p>
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-xs whitespace-pre-wrap">{createTableSQL}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupDatabase;
