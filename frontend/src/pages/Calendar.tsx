import { Container, Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import Layout from '../layout/Layout';
import '../styles/calendar.css';

export default function Calendar() {
  return (
    <Layout>
      <Container 
        maxWidth={false}  // xlからfalseに変更
        sx={{ 
          mt: 4, 
          mb: 4,
          px: { xs: 2, sm: 4 },
          display: 'flex',
          justifyContent: 'center',
          flexGrow: 1,
          overflow: 'hidden',
          maxWidth: '1600px',  // コンテナ自体の最大幅を設定
          margin: '0 auto'     // 中央寄せ
        }}
      >
        <Box 
          id="calendar" 
          sx={{ 
            width: '100%',
            '.fc': {
              '& .fc-scrollgrid': {
                width: '100% !important'
              },
              '& .fc-scrollgrid-section': {
                width: '100% !important'
              },
              '& .fc-scrollgrid-section table, & .fc-scrollgrid-section > td': {
                width: '100% !important'
              },
              '& table': {
                tableLayout: 'fixed !important'
              },
              '& .fc-col-header-cell': {
                width: 'calc(100% / 7) !important'
              },
              '& .fc-daygrid-day': {
                width: 'calc(100% / 7) !important'
              },
              '& .fc-scroller': {
                overflow: 'hidden !important'
              },
              '& .fc-daygrid-body': {
                width: '100% !important',
                '& table': {
                  width: '100% !important'
                }
              }
            }
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={jaLocale}
            firstDay={1}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth'
            }}
            height="auto"
            fixedWeekCount={false}
          />
        </Box>
      </Container>
    </Layout>
  );
}