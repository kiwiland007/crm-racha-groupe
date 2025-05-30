import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AccessibleButton,
  AccessibleInput,
  AccessibleSelect,
  AccessibleTextarea,
  StatusMessage,
} from '../AccessibleComponents';

describe('AccessibleButton', () => {
  it('renders button with children', () => {
    render(<AccessibleButton>Click me</AccessibleButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <AccessibleButton loading loadingText="Loading...">
        Submit
      </AccessibleButton>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('uses default loading text when not provided', () => {
    render(<AccessibleButton loading>Submit</AccessibleButton>);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('applies aria-label when provided', () => {
    render(
      <AccessibleButton aria-label="Custom label">
        Button
      </AccessibleButton>
    );
    
    expect(screen.getByRole('button', { name: 'Custom label' })).toBeInTheDocument();
  });

  it('shows tooltip when provided', () => {
    render(<AccessibleButton tooltip="This is a tooltip">Button</AccessibleButton>);
    
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('This is a tooltip');
  });

  it('is disabled when disabled prop is true', () => {
    render(<AccessibleButton disabled>Button</AccessibleButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading is true', () => {
    render(<AccessibleButton loading>Button</AccessibleButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('AccessibleInput', () => {
  it('renders input with label', () => {
    render(<AccessibleInput label="Name" />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<AccessibleInput label="Email" required />);
    
    const label = screen.getByText('Email');
    expect(label).toBeInTheDocument();
    // Check for required indicator (*)
    expect(label.parentElement).toHaveClass('after:content-[\'*\']');
  });

  it('hides label when hideLabel is true', () => {
    render(<AccessibleInput label="Hidden Label" hideLabel />);
    
    const label = screen.getByText('Hidden Label');
    expect(label).toHaveClass('sr-only');
  });

  it('shows error message', () => {
    render(<AccessibleInput label="Email" error="Invalid email" />);
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows description', () => {
    render(
      <AccessibleInput
        label="Password"
        description="Must be at least 8 characters"
      />
    );
    
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<AccessibleInput label="Email" error="Invalid email" />);
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-required when required', () => {
    render(<AccessibleInput label="Name" required />);
    
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('associates input with error and description', () => {
    render(
      <AccessibleInput
        label="Email"
        error="Invalid email"
        description="Enter your email address"
      />
    );
    
    const input = screen.getByLabelText('Email');
    const ariaDescribedBy = input.getAttribute('aria-describedby');
    
    expect(ariaDescribedBy).toContain('error');
    expect(ariaDescribedBy).toContain('description');
  });
});

describe('AccessibleSelect', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  it('renders select with options', () => {
    render(<AccessibleSelect label="Choose option" options={options} />);
    
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('disables specific options', () => {
    render(<AccessibleSelect label="Choose option" options={options} />);
    
    const option3 = screen.getByRole('option', { name: 'Option 3' });
    expect(option3).toBeDisabled();
  });

  it('shows error message', () => {
    render(
      <AccessibleSelect
        label="Choose option"
        options={options}
        error="Please select an option"
      />
    );
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('AccessibleTextarea', () => {
  it('renders textarea with label', () => {
    render(<AccessibleTextarea label="Comments" />);
    
    expect(screen.getByLabelText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<AccessibleTextarea label="Comments" error="Too long" />);
    
    expect(screen.getByText('Too long')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<AccessibleTextarea label="Comments" error="Too long" />);
    
    const textarea = screen.getByLabelText('Comments');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('StatusMessage', () => {
  it('renders success message', () => {
    render(
      <StatusMessage type="success" title="Success">
        Operation completed successfully
      </StatusMessage>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <StatusMessage type="error">
        Something went wrong
      </StatusMessage>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('renders warning message', () => {
    render(
      <StatusMessage type="warning">
        Please be careful
      </StatusMessage>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Please be careful')).toBeInTheDocument();
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('renders info message', () => {
    render(
      <StatusMessage type="info">
        Here is some information
      </StatusMessage>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Here is some information')).toBeInTheDocument();
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('shows close button when onClose is provided', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <StatusMessage type="info" onClose={onClose}>
        Closable message
      </StatusMessage>
    );
    
    const closeButton = screen.getByRole('button', { name: 'Fermer le message' });
    expect(closeButton).toBeInTheDocument();
    
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not show close button when onClose is not provided', () => {
    render(
      <StatusMessage type="info">
        Non-closable message
      </StatusMessage>
    );
    
    expect(screen.queryByRole('button', { name: 'Fermer le message' })).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for different types', () => {
    const { rerender } = render(
      <StatusMessage type="success">Success</StatusMessage>
    );
    
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800');
    
    rerender(<StatusMessage type="error">Error</StatusMessage>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
    
    rerender(<StatusMessage type="warning">Warning</StatusMessage>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-800');
    
    rerender(<StatusMessage type="info">Info</StatusMessage>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });
});
