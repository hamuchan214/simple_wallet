import { useEffect, useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../layout/Layout';
import { useTagData } from '../lib/useTagData';
import { createTag, deleteTag } from '../api/Tags';
import WarningCard from '../components/WarningCard';

const TagSetting = () => {
  const { tags, isLoading, error, fetchData } = useTagData();
  const [newTagName, setNewTagName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const result = await createTag({ name: newTagName.trim() });
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'タグを追加しました',
          severity: 'success'
        });
        setNewTagName('');
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'タグの追加に失敗しました',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedTagId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTagId) return;

    try {
      const result = await deleteTag(Number(selectedTagId));
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'タグを削除しました',
          severity: 'success'
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'タグの削除に失敗しました',
        severity: 'error'
      });
    }
    setDeleteDialogOpen(false);
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          タグ設定
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="新しいタグ"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
            >
              追加
            </Button>
          </Box>

          <List>
            {isLoading ? (
              <ListItem>
                <ListItemText primary="読み込み中..." />
              </ListItem>
            ) : tags.length === 0 ? (
              <ListItem>
                <ListItemText primary="タグがありません" />
              </ListItem>
            ) : (
              tags.map((tag) => (
                <ListItem key={tag.id} divider>
                  <ListItemText primary={tag.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(tag.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Container>

      <WarningCard
        open={deleteDialogOpen}
        title="タグの削除"
        message="このタグを削除してもよろしいですか？"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Layout>
  );
};

export default TagSetting;
