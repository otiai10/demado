import React from "react";
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'

import { DebugPage } from "../../src/page/DebugPage";

test("renders DebugPage", () => {
  render(<DebugPage />);
  const element = screen.getByText(/DEBUG/);
  expect(element).toBeInTheDocument();
});