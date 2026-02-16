import json
import shutil
import os
import re

# Define paths
FILE_PATH = r"c:\Users\ACER\OneDrive\Desktop\JanTrack Mumbai\JanTrack Mumbai\data_stream.json"
BACKUP_PATH = r"c:\Users\ACER\OneDrive\Desktop\JanTrack Mumbai\JanTrack Mumbai\data_stream_backup_genders_v2.json"

# Titles/Prefixes to strip
PREFIXES = [
    "Adv.", "Advocate", "Dr.", "Capt.", "Mr.", "Mrs.", "Miss", "Smt.", "Kumar", "Kumari", "C.A.", "Prof.", "Comrade", "Pvt.", "Grandfather"
]

MALE_NAMES = {
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Krishna", "Ishaan", "Shaurya",
    "Atharv", "Advik", "Pranav", "Advaith", "Ayaan", "Dhruv", "Kabir", "Ritvik", "Aarush", "Kian",
    "Darsh", "Veer", "Shiv", "Agastya", "Rudra", "Kaivalya", "Avyaan", "Ansh", "Vivaan", "Parth",
    "Rohan", "Rahul", "Amit", "Suresh", "Ramesh", "Sanjay", "Vijay", "Manoj", "Anil", "Sunil",
    "Rajesh", "Prakash", "Ajay", "Dinesh", "Mukesh", "Deepak", "Ganesh", "Mahesh", "Nitin", "Pradeep",
    "Rajendra", "Santosh", "Sandeep", "Vikas", "Vishal", "Yogesh", "Abhishek", "Alok", "Anand", "Ashok",
    "Bharat", "Bhuphinder", "Chetan", "Chirag", "Dev", "Dharmendra", "Gautam", "Gopal", "Harish", "Hemant",
    "Inder", "Jagdish", "Jitendra", "Kamal", "Karan", "Kartik", "Kunal", "Lakshman", "Lalit", "Madhav",
    "Manish", "Mayank", "Mohan", "Narendra", "Naveen", "Nikhil", "Nilesh", "Om", "Pankaj", "Paresh",
    "Pawan", "Prashant", "Praveen", "Prem", "Puneet", "Rajan", "Rajeev", "Rakesh", "Ranjan", "Ravi",
    "Rohit", "Sachin", "Sameer", "Satish", "Sharad", "Shashank", "Shekhar", "Shirish", "Shyam", "Siddharth",
    "Subhash", "Sudhir", "Sumit", "Suraj", "Sushil", "Tarun", "Uday", "Umesh", "Varun", "Vikram",
    "Vinay", "Vinod", "Vivek", "Yash", "Yusuf", "Zahir", "Abdul", "Ahmed", "Ali", "Amir",
    "Asif", "Azhar", "Bilal", "Faizan", "Farhan", "Firoz", "Habib", "Hamza", "Hassan", "Hussain",
    "Imran", "Irfan", "Javed", "Junaid", "Karim", "Khalid", "Mansoor", "Mehboob", "Mohammad", "Mubarak",
    "Mustafa", "Nasir", "Parvez", "Rafiq", "Rahim", "Rahman", "Rashid", "Riaz", "Rizwan", "Salman",
    "Samir", "Shahid", "Shakeel", "Sohail", "Tanveer", "Tusshar", "Umar", "Usman", "Wasim", "Yasin",
    "Zafar", "Zaid", "Zameer", "Akash", "Ankur", "Anup", "Arun", "Ashish", "Avinash", "Bipin",
    "Chandrashekhar", "Dattatray", "Dilip", "Dnyaneshwar", "Eknath", "Gajanan", "Girish", "Gorakh", "Govind", "Hanumant",
    "Hari", "Jayant", "Jaywant", "Kailash", "Kishor", "Lahu", "Laxman", "Machindra", "Mahadeo", "Maruti",
    "Mangesh", "Milind", "Namdev", "Narayan", "Navanth", "Pandurang", "Prabhakar", "Pundlik", "Ragunath", "Ram",
    "Ramchandra", "Ramdas", "Ranganath", "Ravindra", "Sadashiv", "Sambha", "Shankar", "Shantaram", "Shivaji", "Shravan",
    "Shrirang", "Sitaram", "Somanth", "Subhash", "Suresh", "Tukaram", "Uttam", "Vasant", "Vithal", "Yashwant",
    "Mastan", "Shiv", "Kiran", "Himanshu",
    "Ankit", "Dhaval", "Harsh", "Rupesh", "Suhas", "Vitthal", "Zeeshan", "Tajinder", "Parminder",
    # New Batch 1
    "Abbas", "Abhay", "Abhijit", "Abraham", "Abu", "Ahad", "Ahmad", "Ahmedji", "Ajinkya", "Ajit", "Ajmal", "Akbar", 
    "Akshay", "Aleem", "Altaf", "Altamas", "Amar", "Amey", "Amin", "Amol", "Anas", "Aniket", "Anilbhai", "Anish", 
    "Ankush", "Ansal", "Aqib", "Arbaaz", "Arif", "Arvind", "Ashfaq", "Ashraf", "Aslam", "Atish", "Atiullah", "Atul", 
    "Ayush", "Ayyanar", "Azad", "Aziz", "Babanrao", "Babu", "Bajrang", "Balkrishna", "Bapusaheb", "Bhaskar", 
    "Bhausaheb", "Bhavesh", "Bhupendra", "Bhupesh", "Bhushan", "Bhuvnesh", "Bikash", "Biplav", "Brijendra", 
    "Chandan", "Chandrakant", "Chandrapal", "Chirath", "Clive", "Cyril", "Daniyal", "Dashrath", "Daulat", "Devendra", 
    "Dhanaji", "Dhananjay", "Dharmesh", "Dhawal", "Ejaz", "Farooq", "Francis", "Gabriel", "Gaurang", "Gaurav", 
    "Gaus", "George", "Ghanshyam", "Ghulam", "Gitesh", "Gyanraj", "Hafeez", "Haider", "Haji", "Hanif", "Harakchand", 
    "Harishchandra", "Harshvardhan", "Hemanshu", "Huzefa", "Irshad", "Ishtiaq", "Ishwar", "Jai", "Jaidesh", 
    "Jayantilal", "Jayaraj", "Jayesh", "Jaynesh", "John", "Kalam", "Kallu", "Kalpesh", "Kalu", "Kamalkar", "Kamar", 
    "Kamlesh", "Kapil", "Kashif", "Khaire", "Kushal", "Lal", "Madan", "Magan", "Mahadev", "Mahendra", "Manjitsinh", 
    "Manohar", "Mayuresh", "Meezaan", "Mohd.", "Mohsin", "Murlidhar", "Nagesh", "Nanjibhai", "Narayanan", "Navnath", 
    "Nayan", "Nazim", "Neerav", "Nelson", "Nicholas", "Nirajkumar", "Nirmal", "Nirman", "Nishikant", "Nizam", 
    "Nizamuddin", "Numan", "Omkar", "Pakkiyaraj", "Pappu", "Parag", "Paul", "Prahlad", "Pramod", "Pranit", "Prasad", 
    "Pratapbhai", "Prathamesh", "Pratik", "Pravin", "Prince", "Pritam", "Prithvi", "Quaid", "Radheshyam", "Raghunath", 
    "Rahate", "Raj", "Raja", "Rajbali", "Raju", "Rameshwar", "Ramnath", "Ranjit", "Ranveer", "Rathore", "Ritesh", 
    "Robinson", "Roshan", "Sagar", "Saheb", "Saif", "Sainath", "Sajjan", "Samadhan", "Sambhaji", "Sameerbhai", 
    "Sampat", "Sandesh", "Sanjog", "Sanket", "Sarang", "Sardar", "Satyawan", "Saurabh", "Shabbir", "Shahajirao", 
    "Shahir", "Shahnawaz", "Shailendra", "Shailesh", "Shashikant", "Shivkumar", "Shubham", "Siddhesh", "Sikandar", 
    "Sohan", "Solomon", "Somu", "Sonu", "Srinivas", "Sudam", "Sudarshan", "Sudesh", "Sudhanshu", "Sumedh", "Sunny", 
    "Surendra", "Suryakant", "Swapnil", "Syed", "Tilak", "Tofiq", "Tony", "Toufiq", "Tulsiram", "Tushar", "Uddhav", 
    "Vaibhav", "Velamani", "Venugopal", "Vicky", "Vijayendra", "Vilas", "Vinayak", "Vineet", "Vipin", "Viren", 
    "Vishwajit", "Vishwas", "Waheed", "Wajid", "Waqar", "Yogi", "Zahid", "Zakir",
    "अजय", "अरविंद", "उस्मान", "केवट", "गुरुप्रसाद", "गौतम", "जहिद", "प्रदिप", "प्रमोद", "प्रल्हाद", "राजेंद्र", 
    "शिवशरण", "श्रीप्रकाश", "सिद्धिकी",
    "Bhagwan", "Gorakhnath", "Jagganath"
}

FEMALE_NAMES = {
    "Aadya", "Diya", "Saanvi", "Aramgha", "Kiara", "Pari", "Ananya", "Myra", "Riya", "Aarya",
    "Isha", "Kavya", "Avni", "Anvi", "Aditi", "Kyra", "Prisha", "Aahana", "Amaira", "Shanaya",
    "Vanshika", "Anika", "Navya", "Angel", "Siya", "Aarohi", "Anaya", "Fatima", "Zoya", "Zara",
    "Ayesha", "Sana", "Sara", "Maryam", "Safa", "Rida", "Inaya", "Aliya", "Bushra", "Hina",
    "Meera", "Nehta", "Pooja", "Priya", "Rani", "Rekha", "Rita", "Seema", "Shilpa", "Sneha",
    "Sonia", "Sunita", "Swati", "Tanuja", "Usha", "Vandana", "Varsha", "Vidya", "Aarti", "Alka",
    "Anita", "Anju", "Archana", "Aarti", "Bhavana", "Bindu", "Chitra", "Deepa", "Divya", "Ekta",
    "Geeta", "Hema", "Indu", "Jaya", "Jyoti", "Kalpana", "Kamla", "Kanchan", "Kiran", "Komal",
    "Kusum", "Lata", "Lalita", "Leela", "Madhu", "Mala", "Mamta", "Manju", "Meena", "Megha",
    "Mona", "Namita", "Nancy", "Neelam", "Neelu", "Neetu", "Nisha", "Nita", "Nupur", "Padma",
    "Pallavi", "Pinky", "Poonam", "Prabha", "Prachi", "Preeti", "Priti", "Priyanka", "Pushpa", "Rachna",
    "Radha", "Rajni", "Rakhi", "Rashmi", "Reena", "Renu", "Reshma", "Richa", "Rina", "Ritu",
    "Roopa", "Ruby", "Rupa", "Sangita", "Sarita", "Saroj", "Savita", "Shabnam", "Shalini", "Shashi",
    "Sheetal", "Shikha", "Shobha", "Shruti", "Simran", "Suman", "Sushma", "Trishna", "Uma", "Urmila",
    "Vaishali", "Veena", "Sandhya", "Sadichha", "Dakshata", "Leena", "Sonali", "Mukta", "Saroj", "Swati",
    "Ashwini", "Sarika", "Shilpa", "Arati", "Rupali", "Dipali", "Deepali", "Suvarna", "Surekha",
    "Chhaya", "Kavita", "Sangita", "Sangeeta", "Manisha", "Ujjwala", "Yogita", "Nikita", "Monika",
    "Bharti", "Chetna", "Darshana", "Gayatri", "Harsha", "Hemlata", "Jagruti", "Jayshree", "Kanta",
    "Karuna", "Malati", "Mangala", "Nalini", "Nanda", "Neeta", "Nirmala", "Pratibha", "Rajashree",
    "Ranjana", "Renuka", "Rohini", "Rukmini", "Shubhangi", "Smita", "Snehal", "Sujata", "Sunanda",
    "Supriya", "Sushila", "Trupti", "Vasanti", "Vasudha", "Vimal", "Vrinda", "Yamini", "Vidya",
    "Sushmita", "Dhanashree", "Tejal", "Tejashree", "Asmita", "Bhakti", "Gauri", "Kalyani", "Madhuri",
    "Manasi", "Mayuri", "Mitali", "Pranali", "Pranjal", "Pratiksha", "Prajakta", "Rasika", "Rutuja",
    "Sayali", "Sharvari", "Shivani", "Shweta", "Siddhi", "Tanvi", "Unnati", "Urvi", "Vaibhavi", "Varsha",
    "Anjali", "Asha", "Gauravi", "Meenal", "Minal", "Rajeshri", "Sakshi", "Shaila", "Swapna", "Trushna",
    "Foram",
    # New Batch Female
    "Aafia", "Aboli", "Afreen", "Afrin", "Akanksha", "Akshada", "Akshata", "Alia", "Amina", "Amrapali", "Amrita", 
    "Anam", "Anisha", "Ankita", "Anupama", "Anuradha", "Anushree", "Apeksha", "Apoorva", "Apurva", "Aruna", 
    "Asifa", "Asiya", "Asma", "Avanti", "Benazir", "Bhagyalakshmi", "Bhagyashree", "Bharati", "Bilkis", "Bina", 
    "Chandni", "Chandrika", "Deeksha", "Deepika", "Deepti", "Dhanshree", "Dilshad", "Disha", "Falak", "Farah", 
    "Farheen", "Farida", "Farin", "Farzana", "Fauzia", "Firdos", "Gladys", "Halima", "Harshada", "Harshala", 
    "Harshita", "Hasina", "Hazra", "Heena", "Hemali", "Iram", "Ishwari", "Jahanara", "Janhavi", "Jayagauri", 
    "Jayashree", "Jenny", "Jyoti", "Kamini", "Karen", "Kashish", "Khairnusa", "Khushboo", "Kirti", "Kishori", 
    "Kranti", "Kumari", "Kumud", "Laxmi", "Lochana", "Madhavi", "Mahima", "Mamata", "Manali", "Mangal", "Mansi", 
    "Mariammal", "Meghna", "Mehjabeen", "Minashree", "Mohini", "Monali", "Monica", "Mrinalini", "Muskan", "Najma", 
    "Nandini", "Naseema", "Nasreen", "Nausheen", "Navita", "Nayab", "Nayana", "Naz", "Nazia", "Nazneen", "Neela", 
    "Neha", "Nehal", "Nida", "Nidhi", "Nilima", "Nirmala", "Nishrin", "Noor", "Padmavati", "Parubai", "Parvati", 
    "Payal", "Pragya", "Prajyoti", "Pranita", "Prarthana", "Pratima", "Pratishra", "Praveena", "Pravina", 
    "Pushpabai", "Rabia", "Radba", "Radhika", "Rahat", "Rajarajeshwari", "Rajeshree", "Rajlaxmi", "Rajshri", 
    "Rajul", "Ranjita", "Rashida", "Razia", "Rehana", "Rehmat", "Risha", "Rishita", "Rizwana", "Rubina", "Ruchi", 
    "Ruchitatai", "Ruhi", "Rukhsana", "Ruksana", "Rupal", "Rupika", "Saba", "Sabia", "Sabira", "Sadhana", "Sadia", 
    "Saeeda", "Safia", "Sairabano", "Sajida", "Sajidabi", "Sakina", "Salma", "Samidha", "Samiksha", "Samina", 
    "Samita", "Samra", "Samruddhi", "Sania", "Saniksha", "Sanjana", "Sapna", "Savitri", "Sejal", "Serena", 
    "Shabana", "Shahana", "Shaheen", "Shalaka", "Shalinibai", "Shama", "Shamim", "Sharmila", "Shazida", "Shehnaaz", 
    "Sheila", "Shifa", "Shila", "Shraddha", "Shravani", "Shravari", "Shreya", "Shrutika", "Shweta", "Sima", 
    "Snehali", "Snita", "Sonal", "Sonam", "Srishti", "Sudha", "Suhasini", "Sulabha", "Sulochana", "Sumaiya", 
    "Sumitra", "Swaroopa", "Swathi", "Tabassum", "Tajela", "Tarannum", "Taruna", "Tasneem", "Tazain", "Tejaswini", 
    "Tibaah", "Twinkle", "Urjaswala", "Vaishnavi", "Vanita", "Venila", "Vijaya", "Vinita", "Vishakha", "Vrushali", 
    "Vyjayanta", "Yasmin", "Yashodhar", "Zahida", "Zarina", "Zayda", "Zebunisa", "Zeenat",
    "आकांक्षा", "आशा", "नुरबानो", "पार्वती", "माधवी", "राधिका", "रीना", "वर्षा", "शशिकला", "सोनल", "सोनाली",
    "Afrina", "Ajbina", "Ajita", "Akila", "Anija", "Anjum", "Ashwinitai", "Bayakka", "Deepal", "Dipti", 
    "Falguni", "Gausia", "Gausiya", "Hetal", "Ismat", "Kesharben", "Lora"
}

if "Tajinder" in FEMALE_NAMES: FEMALE_NAMES.remove("Tajinder")
if "Parminder" in FEMALE_NAMES: FEMALE_NAMES.remove("Parminder")
MALE_NAMES.update({
    "Ankit", "Dhaval", "Harsh", "Rupesh", "Suhas", "Vitthal", "Zeeshan", "Tajinder", "Parminder",
    "Abrahani", "Ahmadullah", "Arshad", "Baban", "Dharmaraj", "Diwakar", "Ibrahim", "Makrand"
})

if "Kiran" in FEMALE_NAMES: FEMALE_NAMES.remove("Kiran") 
MALE_NAMES.add("Kiran")

def backup_file(src, dest):
    try:
        shutil.copy(src, dest)
        print(f"Backup created at {dest}")
        return True
    except Exception as e:
        print(f"Error creating backup: {e}")
        return False

def clean_name(full_name):
    # Split the name
    parts = full_name.split()
    
    # Filter out prefixes
    cleaned_parts = [p for p in parts if p not in PREFIXES and not p.endswith('.')]
    
    if not cleaned_parts:
        return ""
    
    # Return the first part as probable first name
    return cleaned_parts[0]

def update_genders():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    if not backup_file(FILE_PATH, BACKUP_PATH):
        return

    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    updated_count = 0
    unknown_names = set()

    if isinstance(data, list):
        candidates = data
    elif isinstance(data, dict) and 'candidates' in data:
        candidates = data['candidates']
    else:
        print("Unknown JSON structure")
        return

    for candidate in candidates:
        if 'name' not in candidate:
            continue
        
        full_name = candidate['name']
        first_name = clean_name(full_name)
        
        if not first_name:
            continue
            
        current_gender = candidate.get('gender')
        new_gender = None

        if first_name in MALE_NAMES:
            new_gender = "Male"
        elif first_name in FEMALE_NAMES:
            new_gender = "Female"
        else:
            unknown_names.add(first_name)
        
        # Heuristic checks
        if not new_gender:
            if first_name.endswith("a") or first_name.endswith("i") or first_name.endswith("ee"):
                 pass

        if new_gender and new_gender != current_gender:
            # print(f"Updating {full_name}: {current_gender} -> {new_gender}")
            candidate['gender'] = new_gender
            updated_count += 1

    if unknown_names:
        with open("unknown_names.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(unknown_names)))
        print(f"\n[WARNING] {len(unknown_names)} unique unknown names written to unknown_names.txt")

    if updated_count > 0:
        try:
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            print(f"\nSuccessfully updated {updated_count} candidates.")
        except Exception as e:
            print(f"Error saving JSON: {e}")
    else:
        print("\nNo changes needed.")

if __name__ == "__main__":
    update_genders()
