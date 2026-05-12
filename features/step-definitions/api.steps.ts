import { When, Then, Before } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { apiClient } from '../../utility/api-client.ts';
import type { AxiosResponse } from 'axios';

interface ApiContext {
    response?: AxiosResponse<unknown>;
}

const ctx: ApiContext = {};

Before({ tags: '@api' }, function () {
    ctx.response = undefined;
});

// ─── Request steps ───────────────────────────────────────────────────────────

When('I send a GET request to {string}', async (endpoint: string) => {
    ctx.response = await apiClient.get(endpoint);
});

When('I send a POST request to {string} with body:', async (endpoint: string, rawBody: string) => {
    const body: unknown = JSON.parse(rawBody);
    ctx.response = await apiClient.post(endpoint, body);
});

When('I send a PUT request to {string} with body:', async (endpoint: string, rawBody: string) => {
    const body: unknown = JSON.parse(rawBody);
    ctx.response = await apiClient.put(endpoint, body);
});

When('I send a DELETE request to {string}', async (endpoint: string) => {
    ctx.response = await apiClient.delete(endpoint);
});

// ─── Status assertion ─────────────────────────────────────────────────────────

Then('the API response status should be {int}', (expectedStatus: number) => {
    expect(ctx.response?.status).toBe(expectedStatus);
});

// ─── Products list assertions ─────────────────────────────────────────────────

Then('the response should contain a non-empty products list', () => {
    const data = ctx.response?.data as { products?: unknown[] };
    expect(Array.isArray(data?.products)).toBe(true);
    expect((data.products as unknown[]).length).toBeGreaterThan(0);
});

Then('the products list should contain exactly {int} items', (count: number) => {
    const data = ctx.response?.data as { products?: unknown[] };
    expect(Array.isArray(data?.products)).toBe(true);
    expect((data.products as unknown[]).length).toBe(count);
});

// ─── Single product assertions ────────────────────────────────────────────────

Then('the product should have required fields {string}', (fields: string) => {
    const product = ctx.response?.data as Record<string, unknown>;
    for (const field of fields.split(',')) {
        expect(product).toHaveProperty(field.trim());
    }
});

// ─── Generic body assertions ──────────────────────────────────────────────────

Then('the response body should contain field {string}', (field: string) => {
    const data = ctx.response?.data as Record<string, unknown>;
    expect(data).toHaveProperty(field);
});

Then('the response field {string} should equal {string}', (field: string, expectedValue: string) => {
    const data = ctx.response?.data as Record<string, unknown>;
    expect(String(data[field])).toBe(expectedValue);
});

Then('the response field {string} should be true', (field: string) => {
    const data = ctx.response?.data as Record<string, unknown>;
    expect(data[field]).toBe(true);
});

// ─── Array assertions ─────────────────────────────────────────────────────────

Then('the response should be a non-empty array', () => {
    const data = ctx.response?.data;
    expect(Array.isArray(data)).toBe(true);
    expect((data as unknown[]).length).toBeGreaterThan(0);
});

Then('all products in the list should have category {string}', (category: string) => {
    const data = ctx.response?.data as { products?: Array<{ category: string }> };
    expect(Array.isArray(data?.products)).toBe(true);
    for (const product of data.products ?? []) {
        expect(product.category).toBe(category);
    }
});
