import pandas as pd

def generate_mock_tests():
    print("Running 400 mock Selenium test cases...")
    test_cases = []
    
    for i in range(1, 401):
        test_cases.append({
            "Test Cases": f"Mock Selenium Test {i}",
            "Summary": "Passed"
        })
        
    df = pd.DataFrame(test_cases)
    output_filename = "selenium_mock_results.xlsx"
    df.to_excel(output_filename, index=False)
    
    print(f"Successfully generated {output_filename} with 400 passing test cases.")

if __name__ == "__main__":
    generate_mock_tests()
