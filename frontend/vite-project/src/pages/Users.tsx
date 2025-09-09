import { useQuery } from 'react-query';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const Users = () => {
  const { data: users, isLoading, error } = useQuery('users', async () => {
    const response = await fetch('http://localhost:5000/api/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading users</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      <List>
        {users?.map((user: any) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.name}
              secondary={`${user.email} - ${user.role}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Users; 