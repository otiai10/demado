import React from 'react';
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'

import { CopyRight } from '../../../src/components/info/CopyRight';

test('hoge', () => {
  const repository = 'https://github.com/otiai10/demado';
  render(<CopyRight repository={repository} />)
  const x = screen.getByText('otiai10')
  expect(x).toBeInTheDocument();
  expect(x).toHaveAttribute('href', 'https://github.com/otiai10/');
})