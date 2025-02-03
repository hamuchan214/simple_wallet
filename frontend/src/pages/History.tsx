import { useEffect, useState, useMemo } from 'react';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridActionsCellItem,
  GridRowModesModel,
  GridRowModes,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
} from '@mui/x-data-grid';
import { jaJP } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../lib/localStorage';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ja } from 'date-fns/locale/ja';

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
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      const result = await updateTransaction(newRow.id, {
        date: newRow.date,
        tags: newRow.tags,
        amount: newRow.amount,
        description: newRow.description
      });

      if (result.success) {
        setSnackbar({
          open: true,
          message: '取引を更新しました',
          severity: 'success'
        });
        fetchData();
        return newRow;
      } else {
        setSnackbar({
          open: true,
          message: result.error || '取引の更新に失敗しました',
          severity: 'error'
        });
        throw new Error(result.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: '取引の更新に失敗しました',
        severity: 'error'
      });
      throw error;
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
      editable: true,
      type: 'date',
      valueGetter: (params) => new Date(params),
      renderEditCell: (params) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            value={params.value}
            onChange={(newValue) => {
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: newValue
              });
            }}
            format='yyyy/MM/dd'
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true
              }
            }}
          />
        </LocalizationProvider>
      ),
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
      valueGetter: (value) => {
        if (!value) {
          return value;
        }
        return Number(value);},
      valueFormatter: (params) => {
        if (!params || params == null || params === '') return '';
        return `￥${Number(params).toLocaleString()}`;
      },
      getApplyQuickFilterFn: undefined,
      id: 'amount-field'
    },
    {
      field: 'description',
      headerName: '説明',
      width: 200,
      flex: 1,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="保存"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="キャンセル"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="編集"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="削除"
            onClick={() => handleDelete(Number(id))}
          />,
        ];
      },
    }
  ], [rowModesModel]);

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
          <DataGrid
            rows={Transactions}
            columns={columns}
            loading={isLoading}
            localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
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
        title="取引の削除"
        message="この取引を削除してもよろしいですか？"
        onConfirm={() => handleDeleteConfirm(selectedTransaction as number)}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};

export default History;
