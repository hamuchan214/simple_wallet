import { useEffect, useState, useMemo } from 'react';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { jaJP } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../lib/localStorage';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

//api import
import { updateTransaction } from '../api/Transactions';
import { deleteTransaction } from '../api/Transactions';

//hook import
import { useTransactionData } from '../lib/useTransactionData';


//component import
import Layout from '../layout/Layout';
import { emitEvent } from '../utils/useEventBus';
import WarningCard from '../components/WarningCard';

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

  const [showWarningCard, setShowWarningCard] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  const handleSave = async (id: number, newData: any) => {
    try {
      const result = await updateTransaction(id, {
        date: newData.date,
        tags: newData.tags,
        amount: newData.amount,
        description: newData.description
      });

      if (result.success) {
        setSnackbar({
          open: true,
          message: '取引を更新しました',
          severity: 'success'
        });
        emitEvent('transaction_updated');
      } else {
        setSnackbar({
          open: true,
          message: result.error || '取引の更新に失敗しました',
          severity: 'error'
        });
        setSelectedTransaction(null);
        setShowWarningCard(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: '取引の更新に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleDelete = (id: number) => {
    setShowWarningCard(true);
    setSelectedTransaction(id);
  };

  const handleDeleteCancel = () => {
    setShowWarningCard(false);
    setSelectedTransaction(null);
  };

  const handleDeleteConfirm = async (id: number) => {
    const result = await deleteTransaction(id);
    if (result.success) {
      emitEvent('transaction_updated');
      setSnackbar({
        open: true,
        message: '取引を削除しました',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: result.error || '取引の削除に失敗しました',
        severity: 'error'
      });
    }
    setSelectedTransaction(null);
    setShowWarningCard(false);
  };

  const columns = useMemo<GridColDef[]>(() => [
    { 
      field: 'date',
      headerName: '日付',
      width: 150,
      valueGetter: (value: string) => {
        return new Date(value);
      },
      valueFormatter: (value: Date) => {
        if (!value) return '';
        return (value as Date).toLocaleDateString('ja-JP');
      }
    },
    {
      field: 'tags',
      headerName: 'タグ',
      width: 150,
      editable: true,
    },
    {
      field: 'amount',
      headerName: '金額',
      width: 150,
      editable: true,
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueFormatter: (value: number) => {
        return `￥${value.toLocaleString()}`;
      }
    },
    {
      field: 'description',
      headerName: '説明',
      width: 150,
      flex: 1,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<SaveIcon />}
          label="保存"
          onClick={() => handleSave(params.id as number, params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="削除"
          onClick={() => {
            handleDelete(params.id as number);
          }}
        />,
      ],
    }
  ], []);

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
            editMode="row"
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
      <WarningCard
        open={showWarningCard}
        title='取引履歴の削除'
        message='この取引を削除してもよろしいですか？'
        onCancel={handleDeleteCancel}
        onConfirm={() => handleDeleteConfirm(selectedTransaction as number)}
      />
    </Layout>
  );
};

export default History;
