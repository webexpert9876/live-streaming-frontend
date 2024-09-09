import { Card } from '@mui/material';
import RecentTransactionsTable from './RecentTransactionTable';
import { subDays } from 'date-fns';
import { useState } from 'react';

function RecentTransactions({userData}) {
  const [userDetail, setUserDetail] = useState(userData);

  return (
    <Card>
      {userDetail.length > 0 && <RecentTransactionsTable userDetails={userDetail} /> }
    </Card>
  );
}

export default RecentTransactions;
