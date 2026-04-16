import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';

// Mock the api module before importing Dashboard
jest.mock('../src/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

import Dashboard from '../src/pages/Dashboard';
import { api } from '../src/api';

describe('Dashboard - null tasks state fix', () => {
  /**
   * Verifies the fix for TypeError: Cannot read properties of null (reading 'tasks').
   * Previously, tasks was initialized to null and accessed as tasks.tasks.filter(...)
   * on first render before the API call completed, causing a crash.
   * The fix uses optional chaining (tasks?.tasks?.filter(...)) so the component
   * renders safely while loading, and correctly displays stats once data arrives.
   */

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state without throwing when tasks is null initially', async () => {
    // API never resolves during this test — tasks stays null
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {}));

    let error: Error | null = null;
    try {
      await act(async () => {
        render(<Dashboard />);
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeNull();
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('does not throw TypeError on first render when tasks state is null', async () => {
    // Simulate a delayed API response — component must survive initial null state
    let resolveApi: (value: unknown) => void;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    (api.get as jest.Mock).mockReturnValue(apiPromise);

    // This should not throw even though tasks is null on first render
    expect(() => {
      act(() => {
        render(<Dashboard />);
      });
    }).not.toThrow();
  });

  it('displays correct stats after API resolves with task data', async () => {
    const mockData = {
      tasks: [
        { id: 1, title: 'Task A', status: 'done' },
        { id: 2, title: 'Task B', status: 'in_progress' },
        { id: 3, title: 'Task C', status: 'done' },
        { id: 4, title: 'Task D', status: 'todo' },
      ],
    };

    (api.get as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
      render(<Dashboard />);
    });

    // Should show total count
    expect(screen.getByText('4')).toBeTruthy();
    // Should show done count
    expect(screen.getByText('2')).toBeTruthy();
    // Should show in_progress count
    expect(screen.getByText('1')).toBeTruthy();

    expect(screen.getByText('Total Tasks')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('In Progress')).toBeTruthy();
  });

  it('renders dashboard without crashing when API returns empty task list', async () => {
    const mockData = { tasks: [] };
    (api.get as jest.Mock).mockResolvedValue(mockData);

    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Total Tasks')).toBeTruthy();
  });

  it('renders dashboard without crashing when API call fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    let error: Error | null = null;
    try {
      await act(async () => {
        render(<Dashboard />);
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeNull();
  });
});