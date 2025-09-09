import { useQuery } from 'react-query';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from '@mui/material';

interface TestCase {
  id: number;
  test_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: number;
}

const TestCases = () => {
  const { data: testCases = [], isLoading, error } = useQuery<TestCase[]>('testCases', async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test-cases');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching test cases:', error);
      return [];
    }
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        Error loading test cases
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Test Cases
      </Typography>
      {testCases.length > 0 ? (
        <List>
          {testCases.map((testCase) => (
            <ListItem key={testCase.id}>
              <ListItemText
                primary={testCase.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      ID: {testCase.test_id}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Status: {testCase.status} | Priority: {testCase.priority}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      {testCase.description}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">
          No test cases found. Add some test cases to get started.
        </Typography>
      )}
    </Box>
  );
};

export default TestCases; 