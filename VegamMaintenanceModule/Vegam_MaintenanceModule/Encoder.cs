using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Vegam_MaintenanceModule
{
    public class Encoder
    {
        // define the triple des provider
        private static TripleDESCryptoServiceProvider m_des = new TripleDESCryptoServiceProvider();

        // define the string handler
        private static UTF8Encoding m_utf8 = new UTF8Encoding();

        // define the local property arrays
        private static byte[] m_key;
        private static byte[] m_iv;
        private static byte[] EncryptKey1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
              13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24};
        private static byte[] EncryptKey2 = { 8, 7, 6, 5, 4, 3, 2, 1 };

        static Encoder()
        {
            m_key = EncryptKey1;
            m_iv = EncryptKey2;
        }

        public static string EncryptData(string text)
        {
            byte[] input = m_utf8.GetBytes(text);
            byte[] output = Transform(input,
                            m_des.CreateEncryptor(m_key, m_iv));
            return Convert.ToBase64String(output);
        }

        public static string DecryptData(string text)
        {
            byte[] input = Convert.FromBase64String(text);
            byte[] output = Transform(input,
                            m_des.CreateDecryptor(m_key, m_iv));
            return m_utf8.GetString(output);
        }

        private static byte[] Transform(byte[] input,
                       ICryptoTransform CryptoTransform)
        {
            // create the necessary streams
            MemoryStream memStream = new MemoryStream();
            CryptoStream cryptStream = new CryptoStream(memStream,
                         CryptoTransform, CryptoStreamMode.Write);
            // transform the bytes as requested
            cryptStream.Write(input, 0, input.Length);
            cryptStream.FlushFinalBlock();
            // Read the memory stream and
            // convert it back into byte array
            memStream.Position = 0;
            byte[] result = memStream.ToArray();
            // close and release the streams
            memStream.Close();
            cryptStream.Close();
            // hand back the encrypted buffer
            return result;
        }

    }
}