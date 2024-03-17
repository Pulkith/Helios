def functionToTest(input_str):
    if 'invalid' in input_str.lower():
        raise ValueError("Input string contains the substring 'invalid'.")

    if not isinstance(input_str, str):
        return (None, None, None, None, None, None, None)

    original_str = input_str
    str_length = len(input_str)
    vowels = 'aeiouAEIOU'
    consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
    digits = '0123456789'
    special_chars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

    no_vowels = ''.join([char for char in input_str if char not in vowels])
    no_consonants = ''.join([char for char in input_str if char not in consonants])
    no_digits = ''.join([char for char in input_str if char not in digits])
    no_special_chars = ''.join([char for char in input_str if char not in special_chars])
    is_alphanumeric = all(char.isalnum() for char in input_str)

    return (original_str, str_length, no_vowels, no_consonants, no_digits, no_special_chars, is_alphanumeric)