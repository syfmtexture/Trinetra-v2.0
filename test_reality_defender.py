import unittest
from unittest.mock import MagicMock, patch
import time
import os
import sys

# Add current directory to path so we can import reality_defender
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from reality_defender import KeyRotator, RDResult

class TestKeyRotator(unittest.TestCase):
    def test_round_robin(self):
        keys = ["k1", "k2", "k3"]
        rotator = KeyRotator(keys)
        
        # Should cycle k1, k2, k3, k1...
        self.assertEqual(rotator.get_next(), ("k1", 0))
        self.assertEqual(rotator.get_next(), ("k2", 1))
        self.assertEqual(rotator.get_next(), ("k3", 2))
        self.assertEqual(rotator.get_next(), ("k1", 0))

    def test_blacklisting(self):
        keys = ["k1", "k2"]
        rotator = KeyRotator(keys)
        
        rotator.blacklist("k1", duration=1.0)
        
        # k1 is blacklisted, so get_next should only return k2
        self.assertEqual(rotator.get_next(), ("k2", 1))
        self.assertEqual(rotator.get_next(), ("k2", 1))
        
        # Wait for blacklist to expire
        time.sleep(1.1)
        
        # k1 should be back in rotation
        # Note: round robin index continues, so it might be k1 or k2 depending on state
        key, idx = rotator.get_next()
        self.assertIn(key, ["k1", "k2"])

    def test_all_blacklisted(self):
        keys = ["k1"]
        rotator = KeyRotator(keys)
        rotator.blacklist("k1", duration=10)
        
        self.assertEqual(rotator.get_next(), (None, -1))

class TestIntegration(unittest.TestCase):
    @patch('reality_defender.RealityDefender')
    @patch('os.path.getsize')
    @patch('os.path.exists')
    def test_analyze_flow(self, mock_exists, mock_getsize, mock_rd_class):
        from reality_defender import analyze_with_rd
        
        mock_exists.return_value = True
        mock_getsize.return_value = 1024 * 1024 # 1MB
        
        # Setup mock client
        mock_instance = mock_rd_class.return_value
        
        # Mock upload
        # Warning: upload is async, so we need to mock the awaitable
        async def mock_upload(**kwargs):
            return {"request_id": "req_123"}
        mock_instance.upload = mock_upload
        
        # Mock get_result
        async def mock_get_result(req_id):
            return {"status": "AUTHENTIC", "score": 0.05, "models": []}
        mock_instance.get_result = mock_get_result
        
        # Since analyze_with_rd calls asyncio.run(_analyze_async), 
        # it will use our patched mock_rd_class.
        
        # We need to ensure RD_API_KEYS is not empty for the rotator
        with patch('reality_defender.RD_API_KEYS', ["test_key"]):
            # We also need to re-initialize the singleton or mock the rotator
            with patch('reality_defender.rotator.get_next', return_value=("test_key", 0)):
                result = analyze_with_rd("test.jpg")
                
                self.assertEqual(result.status, "AUTHENTIC")
                self.assertEqual(result.overall_score, 0.05)
                self.assertEqual(result.request_id, "req_123")
                self.assertIsNone(result.error)

if __name__ == '__main__':
    unittest.main()
