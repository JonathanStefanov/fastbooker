import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Modal from '@/components/Modal';

// framer-motion is ESM and needs special handling in tests
// We test the component renders its children when open

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });
});
