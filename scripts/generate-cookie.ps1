# http://blog.oddbit.com/2012/11/04/powershell-random-passwords/
Function random-password($length = 15)
{
    $digits = 48..57
    $letters = 65..90

    # Thanks to
    # https://blogs.technet.com/b/heyscriptingguy/archive/2012/01/07/use-pow
    $password = get-random -count $length `
        -input ($digits + $letters) |
            % -begin { $aa = $null } `
            -process { $aa += [char]$_ } `
            -end { $aa }

    return $password
}

$cookie = random-password(32)

if ($IsWindows)
{
    $filePath = "$PSScriptRoot`\..`\rabbit.env"
}
else
{
    $filePath = "$PSScriptRoot/../rabbit.env"
}

"RABBITMQ_ERLANG_COOKIE=`"$cookie`"
RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS=`"-setcookie $cookie`"" | Out-File $filePath -NoClobber
