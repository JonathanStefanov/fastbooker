import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { UniversityProvider, useUniversity } from '@/components/UniversityContext';

// Test component that exposes context values
function TestConsumer() {
  const ctx = useUniversity();
  return (
    <div>
      <span data-testid="uni-id">{ctx.universityId}</span>
      <span data-testid="uni-name">{ctx.university.shortName}</span>
      <span data-testid="has-selected">{String(ctx.hasSelectedUniversity)}</span>
      <span data-testid="show-modal">{String(ctx.showUniModal)}</span>
      <button data-testid="select" onClick={() => ctx.selectUniversity('unipd')}>Select UniPD</button>
      <button data-testid="open-modal" onClick={ctx.openUniModal}>Open</button>
      <button data-testid="close-modal" onClick={ctx.closeUniModal}>Close</button>
    </div>
  );
}

describe('UniversityContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to ULB when no saved university', () => {
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('uni-id').textContent).toBe('ulb');
    expect(screen.getByTestId('uni-name').textContent).toBe('ULB');
  });

  it('loads saved university from localStorage', () => {
    localStorage.setItem('selectedUniversity', 'unipd');
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('uni-id').textContent).toBe('unipd');
    expect(screen.getByTestId('has-selected').textContent).toBe('true');
  });

  it('selectUniversity updates state and localStorage', () => {
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    act(() => { screen.getByTestId('select').click(); });
    expect(screen.getByTestId('uni-id').textContent).toBe('unipd');
    expect(localStorage.getItem('selectedUniversity')).toBe('unipd');
    expect(screen.getByTestId('has-selected').textContent).toBe('true');
  });

  it('openUniModal and closeUniModal toggle showUniModal', () => {
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('show-modal').textContent).toBe('false');
    act(() => { screen.getByTestId('open-modal').click(); });
    expect(screen.getByTestId('show-modal').textContent).toBe('true');
    act(() => { screen.getByTestId('close-modal').click(); });
    expect(screen.getByTestId('show-modal').textContent).toBe('false');
  });

  it('sets cookie when selecting university', () => {
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    act(() => { screen.getByTestId('select').click(); });
    expect(document.cookie).toContain('selectedUniversity=unipd');
  });

  it('ignores invalid saved university', () => {
    localStorage.setItem('selectedUniversity', 'invalid-uni');
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('uni-id').textContent).toBe('ulb');
  });

  it('auto-opens modal after disclaimer accepted with no university saved', () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    // The modal should auto-open since disclaimer is accepted but no university saved
    expect(screen.getByTestId('show-modal').textContent).toBe('true');
  });

  it('does NOT auto-open modal if university already saved', () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    localStorage.setItem('selectedUniversity', 'unipd');
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('show-modal').textContent).toBe('false');
  });

  it('listens for disclaimerAccepted event', () => {
    render(<UniversityProvider><TestConsumer /></UniversityProvider>);
    expect(screen.getByTestId('show-modal').textContent).toBe('false');
    act(() => {
      window.dispatchEvent(new CustomEvent('disclaimerAccepted'));
    });
    expect(screen.getByTestId('show-modal').textContent).toBe('true');
  });
});
