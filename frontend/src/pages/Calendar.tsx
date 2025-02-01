import { Container, Box, Card, CardContent, Typography, Chip, Stack, Popper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import Layout from '../layout/Layout';
import '../styles/calendar.css';
import { useTransactionData } from '../lib/useTransactionData';
import { useMemo, useEffect, useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../lib/localStorage';

export default function Calendar() {
  const navigate = useNavigate();
  const { Transactions, isLoading, fetchData } = useTransactionData();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const session = checkSession();

    if (!session) {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate, fetchData]);

  const events: EventInput[] = useMemo(() => {
    if (!Transactions) return [];

    return Transactions.map(transaction => ({
      id: transaction.id.toString(),
      title: `¥${Math.abs(transaction.amount).toLocaleString()} ${transaction.description || ''}`,
      date: transaction.date,
      backgroundColor: transaction.amount > 0 ? '#4caf50' : '#f44336',
      borderColor: transaction.amount > 0 ? '#4caf50' : '#f44336',
      textColor: '#ffffff',
      allDay: true,
      extendedProps: {
        tags: transaction.tags,
        amount: transaction.amount
      }
    }));
  }, [Transactions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            events={events}
            eventContent={(eventInfo) => {
              return (
                <>
                  <div style={{ 
                    fontSize: '0.9em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {eventInfo.event.title}
                  </div>
                  <div style={{ 
                    fontSize: '0.8em',
                    opacity: 0.8
                  }}>
                    {eventInfo.event.extendedProps.tags.join(', ')}
                  </div>
                </>
              );
            }}
            eventMouseEnter={(info) => {
              setSelectedEvent(info.event);
              setAnchorEl(info.el);
            }}
            eventMouseLeave={() => {
              setSelectedEvent(null);
              setAnchorEl(null);
            }}
          />
        </Box>
      </Container>

      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="right-start"
        style={{ zIndex: 1000 }}
      >
        {selectedEvent && (
          <Card sx={{ 
            width: 300, 
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" color={selectedEvent.extendedProps.amount > 0 ? 'success.main' : 'error.main'}>
                  ¥{Math.abs(selectedEvent.extendedProps.amount).toLocaleString()}
                </Typography>
                
                {selectedEvent.extendedProps.description && (
                  <Typography variant="body1">
                    {selectedEvent.extendedProps.description}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  {new Date(selectedEvent.startStr).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedEvent.extendedProps.tags.map((tag: string) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Popper>
    </Layout>
  );
}