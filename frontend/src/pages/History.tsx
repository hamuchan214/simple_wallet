import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridCellParams } from '@mui/x-data-grid';
import { jaJP } from '@mui/x-data-grid/locales';
import Layout from '../layout/Layout';
import { useTransactionData } from '../lib/useTransactionData';
import { APITransaction } from '../model/apimodel';

const History = () => {
  const { recentTransactions, isLoading, error } = useTransactionData();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: '日付', 
      width: 150,
      valueGetter: (params: GridRenderCellParams) => 
        new Date(params.row.date).toLocaleDateString('ja-JP')
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
      valueGetter: (params: GridRenderCellParams) => 
        `¥${params.row.amount.toLocaleString()}`,
      cellClassName: (params: GridCellParams) => {
        if (params.value == null) {
          return '';
        }
        return params.row.amount > 0 ? 'income' : 'expense';
      },
    },
    {
      field: 'tags',
      headerName: 'タグ',
      width: 200,
      valueGetter: (params: GridRenderCellParams) => 
        params.row.tags.join(', ')
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
            rows={recentTransactions}
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
    </Layout>
  );
};

export default History;
