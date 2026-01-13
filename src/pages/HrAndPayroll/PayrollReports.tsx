import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PayrollReports() {
    return (
        <div className="max-w-6xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payroll Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">View detailed reports on salary disbursement, statutory contributions, and variances.</p>
                </CardContent>
            </Card>
        </div>
    );
}
