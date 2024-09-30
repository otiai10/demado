import React from 'react';
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'

import { OptionsPage } from '../../src/page/Options';

test('Options', () => {
  render(<OptionsPage />);
  const x = screen.getByText('demadoの設定')
  expect(x).toBeInTheDocument();
});