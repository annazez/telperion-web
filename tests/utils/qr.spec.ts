import { test, expect } from '@playwright/test';
import QRCode from 'qrcode';
import { generateQRDataURI, generateSPDString } from '../../src/utils/qr';

test.describe('QR Code Utils', () => {

  test.describe('generateSPDString', () => {
    test('should generate a basic SPD string with just IBAN', () => {
      const spd = generateSPDString({ iban: 'CZ1234567890' });
      expect(spd).toBe('SPD*1.0*ACC:CZ1234567890*CC:CZK');
    });

    test('should append amount correctly formatted', () => {
      const spd = generateSPDString({ iban: 'CZ123', amount: 150.5 });
      expect(spd).toBe('SPD*1.0*ACC:CZ123*CC:CZK*AM:150.50');
    });

    test('should omit amount if it is 0 or less', () => {
      const spdZero = generateSPDString({ iban: 'CZ123', amount: 0 });
      expect(spdZero).toBe('SPD*1.0*ACC:CZ123*CC:CZK');

      const spdNeg = generateSPDString({ iban: 'CZ123', amount: -10 });
      expect(spdNeg).toBe('SPD*1.0*ACC:CZ123*CC:CZK');
    });

    test('should truncate message to 60 chars', () => {
      const longMessage = 'A'.repeat(70);
      const spd = generateSPDString({ iban: 'CZ123', message: longMessage });
      expect(spd).toBe(`SPD*1.0*ACC:CZ123*CC:CZK*MSG:${'A'.repeat(60)}`);
    });

    test('should combine all fields', () => {
      const spd = generateSPDString({ iban: 'CZ123', amount: 50, message: 'Test donation' });
      expect(spd).toBe('SPD*1.0*ACC:CZ123*CC:CZK*AM:50.00*MSG:Test donation');
    });
  });

  test.describe('generateQRDataURI', () => {
    let originalToDataURL: typeof QRCode.toDataURL;
    let originalConsoleError: typeof console.error;

    test.beforeEach(() => {
      originalToDataURL = QRCode.toDataURL;
      originalConsoleError = console.error;
    });

    test.afterEach(() => {
      QRCode.toDataURL = originalToDataURL;
      console.error = originalConsoleError;
    });

    test('should return data URI on success', async () => {
      // @ts-ignore
      QRCode.toDataURL = async (text: string, options?: any) => {
        expect(text).toContain('SPD*1.0*ACC:CZ123*CC:CZK');
        expect(options).toEqual({
          margin: 1,
          width: 256,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        return 'data:image/png;base64,dummy_data';
      };

      const result = await generateQRDataURI({ iban: 'CZ123' });
      expect(result).toBe('data:image/png;base64,dummy_data');
    });

    test('should return empty string and log error on failure', async () => {
      const mockError = new Error('Mock QR generation error');
      // @ts-ignore
      QRCode.toDataURL = async () => {
        throw mockError;
      };

      let loggedError: any;
      console.error = (msg: string, err: any) => {
        loggedError = { msg, err };
      };

      const result = await generateQRDataURI({ iban: 'CZ123' });

      expect(result).toBe('');
      expect(loggedError.msg).toBe('Error generating QR code');
      expect(loggedError.err).toBe(mockError);
    });
  });
});
