import { useEffect, useState } from 'react';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridCellParams } from '@mui/x-data-grid';
import { jaJP } from '@mui/x-data-grid/locales';
import Layout from '../layout/Layout';
import { useTransactionData } from '../lib/useTransactionData';
import { APITransaction } from '../model/apimodel';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../lib/localStorage';

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

  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: '日付', 
      width: 150,
      valueGetter: (params: GridRenderCellParams) => {
        if (!params.row?.date) return '';
        return new Date(params.row.date).toLocaleDateString('ja-JP');
      }
    },
    { 
      field: 'description', 
      headerName: '説明',
      width: 200,
      flex: 1
    },
    {
      field: 'amount',
      headerName: '金額',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueGetter: (params: GridRenderCellParams) => {
        if (!params.row?.amount) return '';
        return `¥${params.row.amount.toLocaleString()}`;
      },
      cellClassName: (params: GridCellParams) => {
        if (!params.row?.amount) return '';
        return params.row.amount > 0 ? 'income' : 'expense';
      },
    },
    {
      field: 'tags',
      headerName: 'タグ',
      width: 200,
      valueGetter: (params: GridRenderCellParams) => {
        if (!params.row?.tags) return '';
        return params.row.tags.join(', ');
      }
    }
  ];

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
            rows={Transactions ?? []}
            columns={columns}
            loading={isLoading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
              sorting: {
                sortModel: [{ field: 'date', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            disableRowSelectionOnClick
            getRowId={(row: APITransaction) => row.id}
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
