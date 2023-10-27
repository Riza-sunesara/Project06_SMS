#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from 'chalk-animation';

interface Courses {
    c_name:string;
    coursefees:number;
}

class Student implements Courses{
    sname!:string;
    s_fname!:string;
    dob!:Date;
    course!:string;
    balance!: number;
    c_name="jdjhfjdas";
    coursefees=121;

    constructor(sname:string,s_fname:string,dob:Date,balance:number,course:string){
        this.sname=sname;
        this.s_fname=s_fname;
        this.dob=dob;
        this.balance=balance;
        this.course=course;
    }


}
class StudentID extends Student{
    s_ID:string='';
    constructor(sname:string,s_fname:string,dob:Date,balance:number,course:string) {
        super(sname,s_fname,dob,balance,course);
    }

    generate_Sid(){
        let date=this.dob.getDate().toString();
        if(date.length==1){
            date=0+date;
        }
        let arr=[this.sname,this.course].join(' ');
        let str=arr.split(' ');
        for (let i = 0; i < str.length; i++) {
            this.s_ID+=str[i].charAt(0).toUpperCase();
        }
        return this.s_ID+=date;
    }

    check_Sid(rollno:string){
        if(this.s_ID===rollno){
            return true;
        }
        else{
            return false;
        }
    }
}

const sleep=()=>{
    return new Promise((res)=>{
        setTimeout(res,5000);
    })
}

let course=["Computer Science","Mechanical Engineering","Software Engineering","Data Science"];
let students:StudentID[]=[];
let courseFees = new Map<string, number>();
courseFees.set(course[0], 1000);
courseFees.set(course[1], 2000);
courseFees.set(course[2], 3000);
courseFees.set(course[3], 4000);

class Std_Operations extends Student{

    constructor(sname:string,s_fname:string,dob:Date,balance:number,course:string) {
        super(sname,s_fname,dob,balance,course);
    }

    add_in_bal(ans:string,amount:number){
        if(ans=="y"){
            this.balance+=amount;
            return this.balance;
        }
        else{
            console.log(chalk.red.bold("Something went wrong"));
            return this.balance;
        }
    }

    payFees(course:string,ans:string){
        let fees=courseFees.get(course);
        if(typeof fees=="number"&&ans=="Yes"&&this.balance>fees){
            console.log(chalk.blue.bold(`Your fee for the course is: ${fees}`));
            this.balance-=fees;
            console.log(chalk.yellow.bold(`Remaining balance: ${chalk.green.bold(this.balance)}`));
            
        }
        else if(typeof fees=="number"&&this.balance<fees){
            console.log(chalk.red.italic("Insufficient balance"));
        }
        else if(ans=="No"){
            console.log("Exiting");
        }
        else{
            console.log(chalk.italic("Course doesn't exist"));
        }
    }
}

async function balance_check(stud_bal:Std_Operations){
    if(stud_bal.balance<1000){
        console.log(chalk.red.bold(`Insufficient Balance having only ${chalk.green.bold(stud_bal.balance)}/-. Kindly add some amount now!`));
        let nOL=await inquirer.prompt([
            {
                message:"Do you want to add amount y/n",
                name:"ans",
                type:"input"
            }
        ])
        if(nOL.ans==="y"){
            let add_bal=await inquirer.prompt([
                {
                    message:"Add your amount",
                    name:"amount",
                    type:"number"
                }
            ])
            let new_bal=stud_bal.add_in_bal(nOL.ans,add_bal.amount);
            console.log(chalk.green.bold(`Your new balance is: ${new_bal}`));
        }
        else if(nOL.ans==="LATER"){
            console.log(chalk.blue("Noted"));
            console.log(chalk.green.bold(`Your balance is: ${stud_bal.balance}`));
        }
        
    }
    else{
        console.log(chalk.green.bold(`Your current Balance: ${stud_bal.balance}`));
    }
}

async function Add_student() {
    let student=await inquirer.prompt([
        {
            message:"Enter your name:",
            name:"S_name",
            type:"input"
        },
        {
            message:"Enter your Father's name:",
            name:"S_fname",
            type:"input"
        },
        {
            message:"Enter your Date of Birth (YYYY-MM-DD):",
            name:"dob",
            type:"input"
        },
        {
            message:"Enter the course name you wish to study:",
            name:"c_name",
            type:"list",
            choices:course
        },
        {
            message:"Enter balance for payment:",
            name:"bal",
            type:"number"
        }
    ])
    
    let std_id=new StudentID(student.S_name,student.S_fname,new Date(student.dob),student.bal,student.c_name);
    let std_op=new Std_Operations(student.S_name,student.S_fname,new Date(student.dob),student.bal,student.c_name)

    console.log(chalk.blueBright.bold(`Your Rollno Generated for this particular course: ${chalk.yellow.bold(std_id.generate_Sid())}`));
    students.push(std_id);
    console.log(chalk.magenta.bold("Your Enrollment was successful"));

    return std_op;
}

async function Already_stud() {
    let check=await inquirer.prompt([
        {
            message:"Enter your roll no provided at the time of enrollment:",
            name:"Rollno",
            type:"input"
        }
    ])
    let i=students.findIndex(student => student.s_ID === check.Rollno);
    let stu=students[i].check_Sid(check.Rollno);
    let stud_bal=new Std_Operations(students[i].sname,students[i].s_fname,new Date(students[i].dob),students[i].balance,students[i].course);
    Std_Tasks(stu,stud_bal);
}

async function Std_Tasks(stu:boolean,stud_bal:Std_Operations) {
    if(stu){
        let choose=await inquirer.prompt([
            {
                message:"What do you want to do?",
                name:"operation",
                type:"list",
                choices:["View Status","View & Edit Balance","Pay tution fee","Exit"]
            }
        ])
    
        if(choose.operation=="View Status"){
            console.log(chalk.blue.bold(`Name: ${chalk.cyan(stud_bal.sname)} ${chalk.cyan(stud_bal.s_fname)}\nCourses Enrolled: ${chalk.cyan(stud_bal.course)}\nBalance: ${chalk.cyan(stud_bal.balance)}`));
            Std_Tasks(stu,stud_bal);
        }
        else if(choose.operation=="View & Edit Balance"){
            await balance_check(stud_bal);
            Std_Tasks(stu,stud_bal);
        }
        else if(choose.operation=="Pay tution fee"){
            let confirm=await inquirer.prompt([
                {
                    message:"Do you want to proceed Payment?",
                    name:"ans",
                    type:"list",
                    choices:["Yes","No"]
                }
            ])
            stud_bal.payFees(stud_bal.course,confirm.ans);
            Std_Tasks(stu,stud_bal);
        }
        else if(choose.operation=="Exit"){
            let animate=chalkAnimation.pulse("Closing...");
            await sleep();
            animate.stop();
        }
    }
}

async function start() {
    let enter=await inquirer.prompt([
        {
            message:"Choose if you:",
            name:"s_choice",
            type:"list",
            choices:["want to Enroll yourself in a course","are already enrolled","Exit"]
        }
    ])

    if(enter.s_choice=="want to Enroll yourself in a course"){
        let op_obj=await Add_student();
        Already_stud();
    }
    else if(enter.s_choice=="are already enrolled"){
        Already_stud();
    }
    else if(enter.s_choice=="Exit"){
        let animate=chalkAnimation.pulse("Exiting...");
        await sleep();
        animate.stop();
    }
    else{
        console.log(chalk.redBright("You've Chose Wrong Option"));
    }
}

start();
