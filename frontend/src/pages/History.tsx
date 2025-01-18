import { useEffect, useState } from 'react';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { jaJP } from '@mui/x-data-grid/locales';
import Layout from '../layout/Layout';
import { useTransactionData } from '../lib/useTransactionData';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../lib/localStorage';

const columns: GridColDef[] = [
  { 
    field: 'date',
    headerName: '日付',
    width: 150
  },
  {
    field: 'amount',
    headerName: '金額',
    width: 150
  },
  {
    field: 'description',
    headerName: '説明',
    width: 200,
    flex: 1
  },
  {
    field: 'tags',
    headerName: 'タグ',
    width: 200
  }
];

const History = () => {

  const navigate = useNavigate();

  const {
    Transactions,
    isLoading,
    error,
    fetchData
  } = useTransactionData();

  useEffect(() => {
    const session = checkSession();

    if (!session) {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate, fetchData]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success'
  });

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ 
          height: 'calc(100vh - 200px)',
          width: '100%',
          '& .income': {
            color: 'success.main',
          },
          '& .expense': {
            color: 'error.main',
          },
        }}>
          <DataGrid
            rows={Transactions}
            columns={columns}
            loading={isLoading}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false}))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
};

export default History;
