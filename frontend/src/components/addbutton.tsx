import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';

export default function AddButton() {
  return (
    <Fab color="primary" aria-label="add" sx={{ position: 'absolute', bottom: 20, right: 20 }}>
      <AddIcon />
    </Fab>
  );
}