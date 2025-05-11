
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createTableSQL } from '@/lib/db/contacts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Clipboard, CheckCircle, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SetupDatabase = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  
  useEffect(() => {
    // Check if tables already exist
    const checkTables = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('id')
          .limit(1);
        
        if (!error && data) {
          setIsCreated(true);
        }
      } catch (error) {
        console.error('Error checking tables:', error);
      }
    };
    
    checkTables();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createTableSQL);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "SQL has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const createTables = async () => {
    setIsLoading(true);
    try {
      // Use a generic SQL execution RPC - this fixed the type error
      const { error } = await supabase.rpc('run_sql_query', { 
        query: createTableSQL 
      });
      
      if (error) {
        console.error('Error creating tables:', error);
        toast({
          variant: "destructive",
          title: "Error creating tables",
          description: "Please run the SQL manually in the Supabase SQL editor",
        });
      } else {
        toast({
          title: "Tables created successfully",
          description: "Your database is now set up and ready to use",
        });
        setIsCreated(true);
      }
    } catch (error) {
      console.error('Error creating tables:', error);
      toast({
        variant: "destructive",
        title: "Error creating tables",
        description: "Please run the SQL manually in the Supabase SQL editor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Database Setup</h1>
      
      {isCreated ? (
        <Alert className="mb-8 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle>Database is ready!</AlertTitle>
          <AlertDescription>
            Your Supabase database is configured and ready to use.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-8 bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertTitle>Database setup required</AlertTitle>
          <AlertDescription>
            You need to set up your database tables to use this application.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>
            Create the necessary tables in your Supabase project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="automatic">
            <TabsList className="mb-4">
              <TabsTrigger value="automatic">Automatic Setup</TabsTrigger>
              <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="automatic">
              <p className="mb-4">Click the button below to automatically create all required tables in your Supabase project.</p>
              <Button 
                onClick={createTables} 
                disabled={isLoading || isCreated}
                className="w-full"
              >
                {isLoading ? 'Setting up...' : isCreated ? 'Tables Created' : 'Create Tables'}
              </Button>
            </TabsContent>
            
            <TabsContent value="manual">
              <p className="mb-4">Copy the SQL below and run it in the Supabase SQL Editor.</p>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto max-h-[400px] text-xs">
                  {createTableSQL}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-gray-500">
            This will create the following tables: <code>contacts</code>, <code>addresses</code>, <code>tags</code>, and <code>contact_tags</code>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupDatabase;
