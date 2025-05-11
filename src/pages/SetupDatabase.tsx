
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const SetupDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runSampleQueries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the edge function to run the sample queries
      const { data, error } = await supabase.functions.invoke('run-sql-query', {
        body: {
          query: `
            -- Sample queries to populate and manipulate data
            CREATE TABLE IF NOT EXISTS public.inventory_items (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              code TEXT UNIQUE NOT NULL,
              name TEXT NOT NULL,
              category TEXT NOT NULL,
              supplier TEXT,
              unit_price DECIMAL(10, 2) NOT NULL,
              available INTEGER NOT NULL DEFAULT 0,
              reorder_level INTEGER NOT NULL DEFAULT 10,
              last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            -- Clear existing data if any
            DELETE FROM public.inventory_items;
            
            -- Insert sample data
            INSERT INTO public.inventory_items (code, name, category, supplier, unit_price, available, reorder_level)
            VALUES
              ('IMPL-TI-001', 'Titanium Dental Implant 3.5mm', 'Implants', 'DentalCraft Inc.', 129.99, 45, 10),
              ('IMPL-TI-002', 'Titanium Dental Implant 4.0mm', 'Implants', 'DentalCraft Inc.', 139.99, 38, 10),
              ('IMPL-TI-003', 'Titanium Dental Implant 5.0mm', 'Implants', 'DentalCraft Inc.', 149.99, 22, 8),
              ('IMPL-ZR-001', 'Zirconia Implant 3.5mm', 'Implants', 'WhiteDent Medical', 189.99, 15, 5),
              ('IMPL-ZR-002', 'Zirconia Implant 4.0mm', 'Implants', 'WhiteDent Medical', 199.99, 12, 5),
              ('COMP-A2-001', 'Composite Resin A2 Shade', 'Restorative', 'DentalMate Corp', 45.50, 28, 12),
              ('COMP-A3-001', 'Composite Resin A3 Shade', 'Restorative', 'DentalMate Corp', 45.50, 35, 12),
              ('COMP-B2-001', 'Composite Resin B2 Shade', 'Restorative', 'DentalMate Corp', 45.50, 18, 8),
              ('AMAL-001', 'Dental Amalgam Capsules', 'Restorative', 'SilverDent', 35.25, 40, 15),
              ('ANES-LID-001', 'Lidocaine 2% with Epinephrine', 'Anesthetics', 'PainFree Medical', 28.75, 50, 20),
              ('ANES-MEP-001', 'Mepivacaine 3%', 'Anesthetics', 'PainFree Medical', 30.25, 35, 15),
              ('ENDO-FILE-001', 'K-Files Assorted 15-40', 'Endodontic', 'RootMaster', 19.99, 42, 15),
              ('ENDO-FILE-002', 'K-Files Assorted 45-80', 'Endodontic', 'RootMaster', 19.99, 30, 10),
              ('BUR-DIAM-001', 'Diamond Burs FG Round', 'Burs', 'CuttingEdge Tools', 12.50, 65, 25),
              ('BUR-DIAM-002', 'Diamond Burs FG Tapered', 'Burs', 'CuttingEdge Tools', 13.75, 58, 25),
              ('BUR-CARB-001', 'Carbide Burs FG Round', 'Burs', 'CuttingEdge Tools', 9.99, 72, 30),
              ('GLOVE-S', 'Nitrile Gloves Small', 'PPE', 'SafeHands', 8.50, 120, 50),
              ('GLOVE-M', 'Nitrile Gloves Medium', 'PPE', 'SafeHands', 8.50, 85, 50),
              ('GLOVE-L', 'Nitrile Gloves Large', 'PPE', 'SafeHands', 8.50, 95, 50),
              ('MASK-001', 'Surgical Masks Level 3', 'PPE', 'SafeHands', 12.99, 150, 75);
          `
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setSuccess(true);
      toast({
        title: "Database setup successful",
        description: "Sample data has been loaded into your database",
      });
    } catch (err) {
      console.error('Error setting up database:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up database');
      toast({
        variant: "destructive",
        title: "Database setup failed",
        description: err instanceof Error ? err.message : 'Failed to set up database',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Set up your database with sample dental inventory data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Clicking the button below will create and populate the necessary tables in your Supabase
            database with sample dental inventory data.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Database setup completed successfully! You can now explore the application.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={runSampleQueries} 
            disabled={isLoading || success}
          >
            {isLoading ? "Setting up..." : success ? "Setup Complete" : "Set Up Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupDatabase;
